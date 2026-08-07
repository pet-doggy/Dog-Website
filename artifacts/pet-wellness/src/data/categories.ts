export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  bannerImage?: string;
  shortDescription?: string;
  displayOrder: number;
  status: 'Active' | 'Inactive';
  seoTitle?: string;
  metaDescription?: string;
}

export const defaultCategories: Category[] = [
  {
    id: 'cats',
    name: 'Cats',
    slug: 'cats',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80',
    displayOrder: 1,
    status: 'Active'
  },
  {
    id: 'dogs',
    name: 'Dogs',
    slug: 'dogs',
    displayOrder: 2,
    status: 'Active'
  }
];
