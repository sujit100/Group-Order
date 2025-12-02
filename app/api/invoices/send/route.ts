import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { sendInvoiceEmail } from '@/lib/email/invoice-email'
import type { InvoiceData } from '@/lib/pdf/invoice-generator'
import { format } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, groupId } = body

    if (!orderId || !groupId) {
      return NextResponse.json(
        { error: 'Missing orderId or groupId' },
        { status: 400 }
      )
    }

    const supabase = await createServiceRoleClient()

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Get group details (for restaurant name and delivery ETA)
    const { data: group } = await supabase
      .from('groups')
      .select('restaurant_name, delivery_eta')
      .eq('id', groupId)
      .single()

    // Get order items
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (!orderItems) {
      return NextResponse.json(
        { error: 'Order items not found' },
        { status: 404 }
      )
    }

    // Get user summaries
    const { data: userSummaries } = await supabase
      .from('user_order_summary')
      .select('*')
      .eq('order_id', orderId)

    if (!userSummaries) {
      return NextResponse.json(
        { error: 'User summaries not found' },
        { status: 404 }
      )
    }

    // Send invoice to each user
    const emailPromises = userSummaries.map(async (summary) => {
      // Get items for this user
      const userItems = orderItems.filter(
        (item) => item.added_by_email === summary.user_email
      )

      const invoiceData: InvoiceData = {
        userName: summary.user_name,
        userEmail: summary.user_email,
        orderId: order.id,
        restaurantName: group?.restaurant_name || null,
        orderDate: order.ordered_at,
        items: userItems.map((item) => ({
          name: item.item_name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: summary.subtotal,
        taxAmount: summary.tax_amount,
        tipAmount: summary.tip_amount,
        totalAmount: summary.total_amount,
        deliveryEta: group?.delivery_eta || null,
      }

      try {
        await sendInvoiceEmail(invoiceData)

        // Update summary to mark invoice as sent
        await supabase
          .from('user_order_summary')
          .update({
            invoice_sent: true,
            invoice_sent_at: new Date().toISOString(),
          })
          .eq('id', summary.id)
      } catch (error) {
        console.error(`Failed to send invoice to ${summary.user_email}:`, error)
        throw error
      }
    })

    await Promise.all(emailPromises)

    // Mark order as invoices sent
    await supabase
      .from('orders')
      .update({ invoices_sent: true })
      .eq('id', orderId)

    return NextResponse.json({ success: true, sent: userSummaries.length })
  } catch (error) {
    console.error('Error sending invoices:', error)
    return NextResponse.json(
      { error: 'Failed to send invoices', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
