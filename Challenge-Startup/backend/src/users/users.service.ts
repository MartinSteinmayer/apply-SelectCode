import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
    constructor(private readonly supabaseService: SupabaseService) {}
    
    async getUser(userId) {
        const supabaseClient = await this.supabaseService.getClient();

        const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
        if (error) {
        throw error;
        }
    
        return data;
    }
    
}
