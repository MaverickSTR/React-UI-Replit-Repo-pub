// Server-side data fetching functions for use with React Server Components

import { db } from './db';
import { properties, cities } from './schema';
import { desc, eq, like, or, and, gte, lte, sql } from 'drizzle-orm';

/**
 * Fetches featured properties 
 */
export async function getFeaturedProperties(limit = 4) {
  const response = await db.query.properties.findMany({
    where: eq(properties.featured, true),
    orderBy: [desc(properties.rating)],
    limit,
  });
  
  return response;
}

/**
 * Fetches featured cities
 */
export async function getFeaturedCities(limit = 4) {
  const response = await db.query.cities.findMany({
    where: eq(cities.featured, true),
    orderBy: [cities.name],
    limit,
  });
  
  return response;
}

/**
 * Gets a property by ID
 */
export async function getProperty(id: number) {
  const [property] = await db.query.properties.findMany({
    where: eq(properties.id, id),
    limit: 1,
  });
  
  return property;
}

/**
 * Gets a city by name
 */
export async function getCityByName(name: string) {
  const [city] = await db.query.cities.findMany({
    where: eq(cities.name, name),
    limit: 1,
  });
  
  return city;
}

/**
 * Gets properties in a city
 */
export async function getPropertiesByCity(cityName: string, limit = 10, offset = 0) {
  const response = await db.query.properties.findMany({
    where: eq(properties.cityName, cityName),
    orderBy: [desc(properties.rating)],
    limit,
    offset,
  });
  
  return response;
}

/**
 * Gets properties filtered by various parameters
 */
export async function getProperties({
  location,
  checkIn,
  checkOut,
  guests,
  minPrice,
  maxPrice,
  bedrooms,
  bathrooms,
  amenities,
  limit = 10, 
  offset = 0
}: {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  limit?: number;
  offset?: number;
}) {
  // Build the where clause conditions
  let whereConditions = [];
  
  if (location) {
    whereConditions.push(eq(properties.cityName, location));
  }
  
  if (guests) {
    whereConditions.push(gte(properties.maxGuests, guests));
  }
  
  if (minPrice) {
    whereConditions.push(gte(properties.pricePerNight, minPrice));
  }
  
  if (maxPrice) {
    whereConditions.push(lte(properties.pricePerNight, maxPrice));
  }
  
  if (bedrooms) {
    whereConditions.push(gte(properties.bedrooms, bedrooms));
  }
  
  if (bathrooms) {
    whereConditions.push(gte(properties.bathrooms, bathrooms));
  }
  
  // Only add where clause if there are conditions
  const where = whereConditions.length > 0
    ? and(...whereConditions)
    : undefined;
  
  const response = await db.query.properties.findMany({
    where,
    orderBy: [desc(properties.rating)],
    limit,
    offset,
  });
  
  return response;
}