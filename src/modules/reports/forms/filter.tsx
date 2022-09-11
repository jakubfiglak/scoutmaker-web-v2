import { Grid, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Field, Form, Formik } from 'formik'
import { CheckboxWithLabel } from 'formik-mui'
import { useTranslation } from 'next-i18next'

import { Container } from '@/components/forms/container'
import { FilterFormActions } from '@/components/forms/filter-form-actions'
import { RatingRangeSelect } from '@/components/rating-range-select/rating-range-select'
import { CompetitionGroupsCombo } from '@/modules/competition-groups/combo'
import { CompetitionGroupBasicDataDto } from '@/modules/competition-groups/types'
import { CompetitionsCombo } from '@/modules/competitions/combo'
import { CompetitionBasicDataDto } from '@/modules/competitions/types'
import { MatchesCombo } from '@/modules/matches/combo'
import { MatchBasicDataDto } from '@/modules/matches/types'
import { PlayersPositionCombo } from '@/modules/player-positions/combo'
import { PlayerPositionDto } from '@/modules/player-positions/types'
import { PlayersCombo } from '@/modules/players/combo'
import { PlayerBasicDataDto } from '@/modules/players/types'
import { TeamsCombo } from '@/modules/teams/combo'
import { TeamBasicDataDto } from '@/modules/teams/types'

import { ReportsFilterFormData } from '../types'

const StyledCheckboxContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
}))

interface IReportsFilterFormProps {
  playersData: PlayerBasicDataDto[]
  positionsData: PlayerPositionDto[]
  teamsData: TeamBasicDataDto[]
  matchesData: MatchBasicDataDto[]
  competitionsData: CompetitionBasicDataDto[]
  competitionGroupsData: CompetitionGroupBasicDataDto[]
  filters: ReportsFilterFormData
  onFilter: (data: ReportsFilterFormData) => void
  onClearFilters: () => void
}

export const ReportsFilterForm = ({
  playersData,
  teamsData,
  positionsData,
  competitionsData,
  competitionGroupsData,
  matchesData,
  filters,
  onFilter,
  onClearFilters,
}: IReportsFilterFormProps) => {
  const { t } = useTranslation(['common', 'reports'])

  return (
    <Formik
      initialValues={filters}
      onSubmit={data => onFilter(data)}
      enableReinitialize
    >
      {() => (
        <Form autoComplete="off">
          <Container>
            <PlayersCombo
              name="playerIds"
              data={playersData}
              label={t('PLAYERS')}
              multiple
            />
            <PlayersPositionCombo
              name="positionIds"
              data={positionsData}
              label={t('POSITIONS')}
              multiple
            />
            <TeamsCombo
              data={teamsData}
              name="teamIds"
              label={t('TEAMS')}
              multiple
            />
            <MatchesCombo
              data={matchesData}
              name="matchIds"
              label={t('MATCHES')}
              multiple
            />
            <CompetitionsCombo
              name="competitionIds"
              data={competitionsData}
              label={t('COMPETITIONS')}
              multiple
            />
            <CompetitionGroupsCombo
              name="competitionGroupIds"
              data={competitionGroupsData}
              label={t('COMPETITION_GROUPS')}
              multiple
            />
            <RatingRangeSelect
              name="ratingRange"
              label={t('RATING_RANGE')}
              size="small"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field
                  name="playerBornAfter"
                  as={TextField}
                  type="number"
                  variant="outlined"
                  fullWidth
                  label={t('BORN_AFTER')}
                  size="small"
                  inputProps={{ min: 1980, max: 2020, pattern: '/d+', step: 1 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  name="playerBornBefore"
                  as={TextField}
                  type="number"
                  variant="outlined"
                  fullWidth
                  label={t('BORN_BEFORE')}
                  size="small"
                  inputProps={{ min: 1980, max: 2020, pattern: '/d+', step: 1 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StyledCheckboxContainer>
                  <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name="isLiked"
                    Label={{ label: t('reports:LIKED_ONLY') }}
                  />
                </StyledCheckboxContainer>
              </Grid>
              <Grid item xs={6}>
                <StyledCheckboxContainer>
                  <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name="hasVideo"
                    Label={{ label: t('reports:WITH_VIDEO_ONLY') }}
                  />
                </StyledCheckboxContainer>
              </Grid>
            </Grid>
            <FilterFormActions handleClearFilter={onClearFilters} />
          </Container>
        </Form>
      )}
    </Formik>
  )
}