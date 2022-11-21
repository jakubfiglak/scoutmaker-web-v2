import { IComboOptions, IStandardComboOptions } from '@/components/combo/types'
import { RatingRange } from '@/types/rating-range'

import { ICompetitionGroupComboOptions } from '../competition-groups/types'
import { ICompetitionComboOptions } from '../competitions/types'
import { IMatchComboOptions } from '../matches/types'
import { IPlayerPositionComboOptions } from '../player-positions/types'
import { IPlayerComboOptions } from '../players/types'

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
  | 'onlyLikedPlayers'
  | 'onlyLikedTeams'
  | 'onlyNullPlayers'
>

export type NotesFiltersDto = Omit<
  FindAllNotesParams,
  'limit' | 'page' | 'sortBy' | 'sortingOrder'
>

export type NotesFilterFormData = Omit<
  NotesFiltersDto,
  'percentageRatingRangeStart' | 'percentageRatingRangeEnd'
> & { ratingRange: RatingRange }

export type NotesFiltersState = Omit<
  NotesFilterFormData,
  | 'competitionGroupIds'
  | 'competitionIds'
  | 'matchIds'
  | 'playerIds'
  | 'positionIds'
  | 'teamIds'
> & {
  competitionGroupIds: ICompetitionGroupComboOptions[]
  competitionIds: ICompetitionComboOptions[]
  matchIds: IMatchComboOptions[]
  playerIds: IPlayerComboOptions[]
  positionIds: IPlayerPositionComboOptions[]
  teamIds: IStandardComboOptions[]
}

export type NotesSortBy = Paths.NotesControllerFindAll.Parameters.SortBy

export type NoteDto = Components.Schemas.NoteDto

export type CreateNoteDto = Components.Schemas.CreateNoteDto

export type UpdateNoteDto = Components.Schemas.UpdateNoteDto

export interface INotesComboOptions extends IComboOptions {
  player?: Components.Schemas.PlayerBasicDataWithoutTeamsDto
  description?: string
  rating?: number
  shirtNo?: number
}
