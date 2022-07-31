import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'

import { Fab } from '@/components/fab/fab'
import { Loader } from '@/components/loader/loader'
import { ConfirmationModal } from '@/components/modals/confirmation-modal'
import { PageHeading } from '@/components/page-heading/page-heading'
import { withSessionSsr } from '@/modules/auth/session'
import { useCompetitionGroupsList } from '@/modules/competition-groups/hooks'
import { useCompetitionsList } from '@/modules/competitions/hooks'
import { MatchesFilterForm } from '@/modules/matches/forms/filter'
import { useDeleteMatch, useMatches } from '@/modules/matches/hooks'
import { MatchesTableRow } from '@/modules/matches/table/row'
import { MatchesTable } from '@/modules/matches/table/table'
import { MatchesFiltersDto, MatchesSortBy } from '@/modules/matches/types'
import { useSeasonsList } from '@/modules/seasons/hooks'
import { useTeamsList } from '@/modules/teams/hooks'
import { useLocalStorage } from '@/utils/hooks/use-local-storage'
import { useTable } from '@/utils/hooks/use-table'
import { redirectToLogin } from '@/utils/redirect-to-login'

export const getServerSideProps = withSessionSsr(
  async ({ locale, req, res }) => {
    const { user } = req.session

    if (!user) {
      redirectToLogin(res)
      return { props: {} }
    }

    const translations = await serverSideTranslations(locale || 'pl', [
      'common',
      'matches',
    ])

    return {
      props: {
        ...translations,
      },
    }
  },
)

const initialFilters: MatchesFiltersDto = {
  competitionIds: [],
  groupIds: [],
  hasVideo: false,
  seasonId: 0,
  teamId: 0,
}

interface IMatchToDeleteData {
  id: number
  name: string
}

const MatchesPage = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false)
  const [matchToDeleteData, setMatchToDeleteData] =
    useState<IMatchToDeleteData | null>(null)

  const {
    tableSettings: { page, rowsPerPage, sortBy, order },
    handleChangePage,
    handleChangeRowsPerPage,
    handleSort,
  } = useTable('matches-table')

  const [filters, setFilters] = useLocalStorage<MatchesFiltersDto>({
    key: 'matches-filters',
    initialValue: initialFilters,
  })

  function handleSetFilters(newFilters: MatchesFiltersDto) {
    setFilters(newFilters)
    handleChangePage(null, 0)
  }

  const { data: teams, isLoading: teamsLoading } = useTeamsList()
  const { data: competitions, isLoading: competitionsLoading } =
    useCompetitionsList()
  const { data: competitionGroups, isLoading: competitionGroupsLoading } =
    useCompetitionGroupsList()
  const { data: seasons, isLoading: seasonsLoading } = useSeasonsList()

  const { data: matches, isLoading: matchesLoading } = useMatches({
    page: page + 1,
    limit: rowsPerPage,
    sortBy: sortBy as MatchesSortBy,
    sortingOrder: order,
    ...filters,
  })

  const { mutate: deleteMatch, isLoading: deleteMatchLoading } =
    useDeleteMatch()

  const isLoading =
    teamsLoading ||
    competitionsLoading ||
    competitionGroupsLoading ||
    matchesLoading ||
    seasonsLoading ||
    deleteMatchLoading

  return (
    <>
      {isLoading && <Loader />}
      <PageHeading title={t('matches:INDEX_PAGE_TITLE')} />
      <MatchesFilterForm
        filters={filters}
        teamsData={teams || []}
        competitionsData={competitions || []}
        competitionGroupsData={competitionGroups || []}
        seasonsData={seasons || []}
        onFilter={handleSetFilters}
        onClearFilters={() => handleSetFilters(initialFilters)}
      />
      <MatchesTable
        page={page}
        rowsPerPage={rowsPerPage}
        sortBy={sortBy}
        order={order}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleSort={handleSort}
        total={matches?.totalDocs || 0}
        actions
      >
        {matches
          ? matches.docs.map(match => (
              <MatchesTableRow
                key={match.id}
                data={match}
                onEditClick={() => {
                  router.push(`/matches/edit/${match.id}`)
                }}
                onDeleteClick={() => {
                  setMatchToDeleteData({
                    id: match.id,
                    name: `${match.homeTeam.name} vs. ${match.awayTeam.name}`,
                  })
                  setIsDeleteConfirmationModalOpen(true)
                }}
                isEditOptionEnabled
                isDeleteOptionEnabled
              />
            ))
          : null}
      </MatchesTable>
      <Fab href="/matches/create" />
      <ConfirmationModal
        open={isDeleteConfirmationModalOpen}
        message={t('matches:DELETE_MATCH_CONFIRM_QUESTION', {
          name: matchToDeleteData?.name,
        })}
        handleAccept={() => {
          if (matchToDeleteData) {
            deleteMatch(matchToDeleteData.id)
          }
          setMatchToDeleteData(null)
        }}
        handleClose={() => {
          setIsDeleteConfirmationModalOpen(false)
          setMatchToDeleteData(null)
        }}
      />
    </>
  )
}

export default MatchesPage
