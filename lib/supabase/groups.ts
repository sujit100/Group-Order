import { createClient } from './client'
import { generateGroupCode } from '@/lib/utils/code-generator'
import type { Database } from '@/types/database'

export interface CreateGroupParams {
  email: string
  firstName: string
}

export interface JoinGroupParams {
  code: string
  email: string
  firstName: string
}

/**
 * Create a new group with a unique code
 */
export async function createGroup({ email, firstName }: CreateGroupParams) {
  const supabase = createClient()
  
  // Generate a unique code
  let code = generateGroupCode()
  let attempts = 0
  const maxAttempts = 10
  
  // Ensure code is unique
  while (attempts < maxAttempts) {
    const { data: existing } = await supabase
      .from('groups')
      .select('id')
      .eq('code', code)
      .single()
    
    if (!existing) {
      break // Code is unique
    }
    
    code = generateGroupCode()
    attempts++
  }
  
  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique group code')
  }
  
  // Create the group
  type GroupInsert = Database['public']['Tables']['groups']['Insert']
  type GroupRow = Database['public']['Tables']['groups']['Row']
  const groupInsert: GroupInsert = {
    code,
    status: 'browsing',
  }
  
  const { data: groupData, error: groupError } = await (supabase
    .from('groups') as any)
    .insert(groupInsert)
    .select()
    .single()
  
  if (groupError || !groupData) {
    throw new Error(`Failed to create group: ${groupError?.message}`)
  }
  
  const group = groupData as GroupRow
  
  // Add the creator as a member
  type GroupMemberInsert = Database['public']['Tables']['group_members']['Insert']
  const memberInsert: GroupMemberInsert = {
    group_id: group.id,
    email,
    first_name: firstName,
  }
  
  const { error: memberError } = await (supabase
    .from('group_members') as any)
    .insert(memberInsert)
  
  if (memberError) {
    throw new Error(`Failed to add member: ${memberError.message}`)
  }
  
  return { group, code }
}

/**
 * Join an existing group by code
 */
export async function joinGroup({ code, email, firstName }: JoinGroupParams) {
  const supabase = createClient()
  
  // Find the group by code
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .select('id, status')
    .eq('code', code.toUpperCase())
    .single()
  
  if (groupError || !group) {
    throw new Error('Group not found')
  }
  
  // Check if user is already a member
  type GroupRow = Database['public']['Tables']['groups']['Row']
  const typedGroup = group as GroupRow
  
  const { data: existingMember } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', typedGroup.id)
    .eq('email', email)
    .single()
  
  if (existingMember) {
    return { group, isNewMember: false }
  }
  
  // Add user as a member
  type GroupMemberInsert = Database['public']['Tables']['group_members']['Insert']
  const memberInsert: GroupMemberInsert = {
    group_id: typedGroup.id,
    email,
    first_name: firstName,
  }
  
  const { error: memberError } = await (supabase
    .from('group_members') as any)
    .insert(memberInsert)
  
  if (memberError) {
    throw new Error(`Failed to join group: ${memberError.message}`)
  }
  
  return { group: typedGroup, isNewMember: true }
}

/**
 * Get group details
 */
export async function getGroup(groupId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single()
  
  if (error) {
    throw new Error(`Failed to get group: ${error.message}`)
  }
  
  return data
}

/**
 * Get group members
 */
export async function getGroupMembers(groupId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', groupId)
    .order('joined_at', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to get members: ${error.message}`)
  }
  
  return data || []
}

/**
 * Get user's info for a group
 */
export async function getUserInfo(groupId: string, email: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', groupId)
    .eq('email', email)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
}
