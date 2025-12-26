import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { PaginatedResult } from '../dtos/paginated-result.interface';

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResult<T>> {
  const skip = (page - 1) * limit;

  const [items, totalItems] = await queryBuilder
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    meta: {
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    },
  };
}
