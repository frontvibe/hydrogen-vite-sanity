import groq from 'groq';

export const PAGE_QUERY = groq`*[_type == "page"][0] {
  title,
  description
}`;
