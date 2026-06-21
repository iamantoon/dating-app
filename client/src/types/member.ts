export type Member = {
  id: string;
  dateOfBirth: string;
  imageUrl?: string;
  displayName: string;
  created: string;
  lastActive: string;
  gender: string;
  description?: string;
  city: string;
  country: string;
}

export type Photo = {
  id: number;
  url: string;
  publicId?: string;
  memberId: string;
  isApproved: boolean;
}

export type EditableMember = {
  displayName: string;
  description?: string;
  city: string;
  country: string;
}

export class MemberParams {
  public gender?: string;
  public minAge = 18;
  public maxAge = 100;
  public pageNumber = 1;
  public pageSize = 10;
  public orderBy = 'lastActive';
}
