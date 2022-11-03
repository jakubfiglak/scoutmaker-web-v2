import { Add as AddIcon } from '@mui/icons-material'
import { AppBar, Box, Button, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

import { ErrorContent } from '@/components/error/error-content'
import { Loader } from '@/components/loader/loader'
import { PageHeading } from '@/components/page-heading/page-heading'
import { TabPanel } from '@/components/tab-panel/tab-panel'
import { useCompetitionParticipations } from '@/modules/competition-participations/hooks'
import { CompetitionParticipationsTable } from '@/modules/competition-participations/table/table'
import { CompetitionParticipationsSortBy } from '@/modules/competition-participations/types'
import { useMatches } from '@/modules/matches/hooks'
import { MatchesTable } from '@/modules/matches/table/table'
import { MatchesSortBy } from '@/modules/matches/types'
import { PlayersBasicTable } from '@/modules/players/basicTable/table'
import { useTeamAffiliations } from '@/modules/team-affiliations/hooks'
import { TeamAffiliationsSortBy } from '@/modules/team-affiliations/types'
import { TeamDetailsCard } from '@/modules/teams/details-card'
import { TeamDto } from '@/modules/teams/types'
import { getTeamBySlug } from '@/services/api/methods/teams'
import { ApiError } from '@/services/api/types'
import { useTable } from '@/utils/hooks/use-table'
import { TSsrRole, withSessionSsrRole } from '@/utils/withSessionSsrRole'

interface TTeamPageProps {
  team: TeamDto
  isAdmin: boolean
}

export const getServerSideProps = withSessionSsrRole<TTeamPageProps>(
  ['common', 'teams'],
  false,
  async (token, params, user) => {
    try {
      const team = await getTeamBySlug(params?.slug as string, token)
      return { data: { team, isAdmin: user?.role === 'ADMIN' } }
    } catch (error) {
      return { data: null, error: error as ApiError }
    }
  },
)

const TeamPage = ({
  errorMessage,
  errorStatus,
  data,
}: TSsrRole<TTeamPageProps>) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: any, newValue: number) =>
    setTabValue(newValue)

  const {
    tableSettings: CompetitionParticipationTableSettings,
    ...CompetitionParticipationTableProps
  } = useTable(
    `competition-participations-table-team:${data?.team.id}`,
    'seasonId',
  )

  const {
    tableSettings: PlayersBasicTableSettings,
    ...PlayersBasicTableProps
  } = useTable(`players-basic-table-team:${data?.team.id}`)

  const { tableSettings: MatchesTableSettings, ...MatchesTableProps } =
    useTable(`matches-table-team:${data?.team.id}`)

  const { data: participations, isLoading: participationsLoading } =
    useCompetitionParticipations({
      page: CompetitionParticipationTableSettings.page + 1,
      limit: CompetitionParticipationTableSettings.rowsPerPage,
      sortBy:
        CompetitionParticipationTableSettings.sortBy as CompetitionParticipationsSortBy,
      sortingOrder: CompetitionParticipationTableSettings.order,
      teamId: data?.team.id || '',
    })

  const { data: affiliations, isLoading: affiliationsLoading } =
    useTeamAffiliations({
      page: PlayersBasicTableSettings.page + 1,
      limit: PlayersBasicTableSettings.rowsPerPage,
      sortBy: PlayersBasicTableSettings.sortBy as TeamAffiliationsSortBy,
      sortingOrder: PlayersBasicTableSettings.order,
      teamId: data?.team.id || '',
    })

  const { data: matches, isLoading: matchesLoading } = useMatches({
    page: MatchesTableSettings.page + 1,
    limit: MatchesTableSettings.rowsPerPage,
    sortBy: MatchesTableSettings.sortBy as MatchesSortBy,
    sortingOrder: MatchesTableSettings.order,
    teamId: data?.team.id || '',
  })

  const players =
    affiliations?.docs
      .filter(aff => aff.endDate === null)
      .map(aff => aff.player) || []

  const isLoading =
    matchesLoading || participationsLoading || affiliationsLoading

  if (!data) return <ErrorContent message={errorMessage} status={errorStatus} />
  const { team, isAdmin } = data
  return (
    <>
      {isLoading && <Loader />}
      <PageHeading title={team.name} />
      <TeamDetailsCard team={team} />
      <Box width="100%" marginTop={theme => theme.spacing(4)}>
        <AppBar
          position="static"
          sx={theme => ({
            marginBottom: theme.spacing(1),
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          })}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="affiliations-players-matches-tabs"
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            sx={theme => ({
              '& .MuiTab-root': {
                [theme.breakpoints.down('sm')]: {
                  fontSize: 10,
                },
              },
            })}
            centered
          >
            <Tab label={t('TEAM_AFFILIATIONS')} />
            <Tab label={t('PLAYERS')} />
            <Tab label={t('MATCHES')} />
          </Tabs>
        </AppBar>
        <TabPanel
          value={tabValue}
          index={0}
          title="competition-participations"
          noPadding
        >
          {isAdmin && (
            <Button
              variant="contained"
              disableElevation
              sx={theme => ({
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: -1,
                [theme.breakpoints.down('sm')]: {
                  fontSize: 11,
                },
              })}
              fullWidth
              onClick={() =>
                router.push(
                  `/competition-participations/create?teamId=${team.id}`,
                )
              }
            >
              {t('ADD')} <AddIcon sx={{ height: '0.8em' }} />
            </Button>
          )}
          <CompetitionParticipationsTable
            {...CompetitionParticipationTableSettings}
            {...CompetitionParticipationTableProps}
            total={participations?.totalDocs || 0}
            data={participations?.docs || []}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1} title="players" noPadding>
          <PlayersBasicTable
            {...PlayersBasicTableProps}
            {...PlayersBasicTableSettings}
            data={players}
            total={players.length}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2} title="matches" noPadding>
          <MatchesTable
            {...MatchesTableSettings}
            {...MatchesTableProps}
            total={matches?.totalDocs || 0}
            data={matches?.docs || []}
          />
        </TabPanel>
      </Box>
    </>
  )
}

export default TeamPage
