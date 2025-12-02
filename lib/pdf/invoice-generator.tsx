import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { format } from 'date-fns'

export interface InvoiceData {
  userName: string
  userEmail: string
  orderId: string
  restaurantName: string | null
  orderDate: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  taxAmount: number
  tipAmount: number
  totalAmount: number
  deliveryEta: string | null
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1pt solid #ddd',
    paddingBottom: 5,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 8,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
  },
  tableColItem: {
    width: '40%',
  },
  tableColQuantity: {
    width: '15%',
  },
  tableColPrice: {
    width: '20%',
    textAlign: 'right',
  },
  tableCell: {
    fontSize: 10,
  },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    marginBottom: 5,
    fontSize: 10,
  },
  totalLabel: {
    color: '#666',
  },
  totalValue: {
    fontWeight: 'bold',
  },
  finalTotal: {
    fontSize: 16,
    marginTop: 10,
    paddingTop: 10,
    borderTop: '2pt solid #333',
  },
  footer: {
    marginTop: 40,
    fontSize: 9,
    color: '#666',
    textAlign: 'center',
  },
})

const InvoiceDocument: React.FC<{ data: InvoiceData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoice</Text>
        <Text style={styles.subtitle}>Order #{data.orderId.slice(0, 8).toUpperCase()}</Text>
        <Text style={styles.subtitle}>Date: {format(new Date(data.orderDate), 'MMMM d, yyyy')}</Text>
        {data.restaurantName && (
          <Text style={styles.subtitle}>Restaurant: {data.restaurantName}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Bill To:</Text>
        <Text style={styles.subtitle}>{data.userName}</Text>
        <Text style={styles.subtitle}>{data.userEmail}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableColItem]}>Item</Text>
            <Text style={[styles.tableCell, styles.tableColQuantity]}>Qty</Text>
            <Text style={[styles.tableCell, styles.tableColPrice]}>Price</Text>
            <Text style={[styles.tableCell, styles.tableColPrice]}>Total</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableColItem]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.tableColQuantity]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.tableColPrice]}>
                ${item.price.toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, styles.tableColPrice]}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>${data.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax:</Text>
          <Text style={styles.totalValue}>${data.taxAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tip:</Text>
          <Text style={styles.totalValue}>${data.tipAmount.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.finalTotal]}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>${data.totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {data.deliveryEta && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            Estimated Delivery: {format(new Date(data.deliveryEta), 'MMMM d, yyyy h:mm a')}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text>Thank you for your order!</Text>
      </View>
    </Page>
  </Document>
)

export async function generateInvoicePDF(data: InvoiceData): Promise<Uint8Array> {
  const blob = await pdf(<InvoiceDocument data={data} />).toBlob()
  const arrayBuffer = await blob.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}
