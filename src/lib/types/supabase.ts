export type MessageSender = string;

export type MessageRow = {
	id: string;
	created_at: string;
	wa_no: string;
	content: string;
	sender: MessageSender;
};

export type Database = {
	public: {
		Tables: {
			messages: {
				Row: MessageRow;
				Insert: {
					id?: string;
					created_at?: string;
					wa_no: string;
					content: string;
					sender: MessageSender;
				};
				Update: {
					id?: string;
					created_at?: string;
					wa_no?: string;
					content?: string;
					sender?: MessageSender;
				};
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
};

export type Message = Database['public']['Tables']['messages']['Row'];

export type ContactItem = {
	waNo: string;
	lastMessage: string;
	lastMessageAt: string;
};
