import { RatingRange } from '@/types/rating-range'

export type NoteBasicDataDto = Components.Schemas.NoteBasicDataDto

export type FindAllNotesParams = Pick<
  Paths.NotesControllerFindAll.QueryParameters,
  | 'competitionGroupIds'
  | 'competitionIds'
  | 'isLiked'
  | 'limit'
  | 'matchIds'
  | 'page'
  | 'percentageRatingRangeEnd'
  | 'percentageRatingRangeStart'
  | 'playerBornAfter'
  | 'playerBornBefore'
  | 'playerIds'
  | 'positionIds'
  | 'sortBy'
  | 'sortingOrder'
  | 'teamIds'
  | 'userId'
>

export type NotesFiltersDto = Omit<
  FindAllNotesParams,
  'limit' | 'page' | 'sortBy' | 'sortingOrder'
>

export type NotesFilterFormData = Omit<
  NotesFiltersDto,
  'percentageRatingRangeStart' | 'percentageRatingRangeEnd'
> & { ratingRange: RatingRange }

export type NotesSortBy = Paths.NotesControllerFindAll.Parameters.SortBy

export type NoteDto = Components.Schemas.NoteDto

export type CreateNoteDto = Components.Schemas.CreateNoteDto

export type UpdateNoteDto = Components.Schemas.UpdateNoteDto
