export interface ContentIllustration {
  id: string;
  content_section_id: string;
  type: "image" | "video";
  url: string;
  caption?: string;
}

export interface ContentSection {
  id: string;
  education_id: string;
  section_order: number;
  heading: string;
  paragraph: string;
  slug: string;
  illustration?: ContentIllustration;
}

export interface ImportantPoint {
  id: string;
  education_id: string;
  point_order: number;
  content: string;
}

export interface Conclusion {
  id: string;
  education_id: string;
  heading: string;
  paragraph: string;
}

export interface TableOfContentsItem {
  id: string;
  education_id: string;
  item_order: number;
  title: string;
  slug: string;
}

export interface Author {
  name: string;
  avatar?: string;
}

export interface EducationWithDetails {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  category: string;
  tags: string[];
  author_id: string;
  status: "edukasi populer" | "edukasi biasa";
  view_count: number;
  like_count: number;
  reading_time: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  content_sections: ContentSection[];
  important_points?: ImportantPoint[];
  conclusion: Conclusion;
  table_of_contents?: TableOfContentsItem[];
  author?: Author;
}
