import { createClient } from '@/lib/supabase/client'

export interface Member {
  id: string
  user_id: string
  name: string
  color: string
  is_default: boolean
  created_at: string
}

export const memberService = {
  async getMembers(): Promise<Member[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  },

  async addMember(name: string, color: string): Promise<Member> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('members')
      .insert({
        name,
        color,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteMember(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async setDefaultMember(id: string): Promise<void> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Start a simple transaction-like sequence (though PostgREST isn't transactional across calls here, 
    // it's fine for this scale)
    // 1. Unset any existing default
    await supabase
      .from('members')
      .update({ is_default: false })
      .eq('user_id', user.id)

    // 2. Set the new default
    const { error } = await supabase
      .from('members')
      .update({ is_default: true })
      .eq('id', id)

    if (error) throw error
  }
}
