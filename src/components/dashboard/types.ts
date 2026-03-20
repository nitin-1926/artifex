import { RoomVisibility, type User } from '@prisma/client';

export type RoomMember = Pick<User, 'id' | 'email' | 'name'>;

export type RoomCardData = {
	id: string;
	title: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	visibility: RoomVisibility;
	ownerId: string;
	owner: RoomMember;
	collaborators: RoomMember[];
};
