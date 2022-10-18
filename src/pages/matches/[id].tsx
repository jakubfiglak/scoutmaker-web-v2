import { Box, styled, Tab, Tabs, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

import { ErrorContent } from '@/components/error/error-content'
import { Loader } from '@/components/loader/loader'
import { PageHeading } from '@/components/page-heading/page-heading'
import { TabPanel } from '@/components/tab-panel/tab-panel'
import { MatchDetailsCard } from '@/modules/matches/details-card'
import { MatchDto } from '@/modules/matches/types'
import { getMatchDisplayName } from '@/modules/matches/utils'
import { useLikeNote, useNotes, useUnlikeNote } from '@/modules/notes/hooks'
import { NotesTable } from '@/modules/notes/table/table'
import {
  useLikeReport,
  useReports,
  useUnlikeReport,
} from '@/modules/reports/hooks'
import { ReportsTable } from '@/modules/reports/table/table'
import { getMatchById } from '@/services/api/methods/matches'
import { ApiError } from '@/services/api/types'
import { useTable } from '@/utils/hooks/use-table'
import { TSsrRole, withSessionSsrRole } from '@/utils/withSessionSsrRole'

export const getServerSideProps = withSessionSsrRole<MatchDto>(
  ['common', 'matches'],
  false,
  async (token, params) => {
    try {
      const data = await getMatchById(params?.id as string, token)
      return { data }
    } catch (error) {
      return { data: null, error: error as ApiError }
    }
  },
)

const MatchPage = ({ data, errorMessage, errorStatus }: TSsrRole<MatchDto>) => {
  const { t } = useTranslation()
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const { tableSettings: homeNoteTableSettings, ...homeNotesTableProps } =
    useTable(`matches-notes-table-home`)
  const { data: homeTeamNotes, isLoading: homeTeamNotesLoading } = useNotes({
    matchIds: [data?.id || ''],
    teamIds: [data?.homeTeam.id || ''],
  })

  const { tableSettings: awayNoteTableSettings, ...awayNotesTableProps } =
    useTable(`matches-notes-table-away`)
  const { data: awayTeamNotes, isLoading: awayTeamNotesLoading } = useNotes({
    matchIds: [data?.id || ''],
    teamIds: [data?.awayTeam.id || ''],
  })

  const { tableSettings: homeReportsTableSettings, ...homeReportsTableProps } =
    useTable(`matches-reports-table-home`)
  const { data: homeTeamReports, isLoading: homeTeamReportsLoading } =
    useReports({
      matchIds: [data?.id || ''],
      teamIds: [data?.homeTeam.id || ''],
    })

  const { tableSettings: awayReportsTableSettings, ...awayReportsTableProps } =
    useTable(`matches-reports-table-away`)
  const { data: awayTeamReports, isLoading: awayTeamReportsLoading } =
    useReports({
      matchIds: [data?.id || ''],
      teamIds: [data?.awayTeam.id || ''],
    })

  const { mutate: likeNote, isLoading: likeNoteLoading } = useLikeNote()
  const { mutate: unLikeNote, isLoading: unLikeNoteLoading } = useUnlikeNote()

  const { mutate: likeReport, isLoading: likeReportLoading } = useLikeReport()
  const { mutate: unLikeReport, isLoading: unLikeReportLoading } =
    useUnlikeReport()

  const isLoading =
    homeTeamNotesLoading ||
    likeNoteLoading ||
    unLikeNoteLoading ||
    awayTeamNotesLoading ||
    homeTeamReportsLoading ||
    awayTeamReportsLoading ||
    likeReportLoading ||
    unLikeReportLoading

  if (!data) return <ErrorContent message={errorMessage} status={errorStatus} />
  return (
    <>
      {isLoading && <Loader />}
      <PageHeading
        title={getMatchDisplayName({
          homeTeamName: data.homeTeam.name,
          awayTeamName: data.awayTeam.name,
        })}
      />
      <MatchDetailsCard match={data} />

      <Box width="100%" marginTop={theme => theme.spacing(2)}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="teams-notes-reports-tab"
            centered
          >
            <Tab label={data.homeTeam.name} />
            <Tab label={data.awayTeam.name} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0} title="home-team" noPadding>
          <SectionHeading title={t('NOTES')} />
          <NotesTable
            {...homeNoteTableSettings}
            {...homeNotesTableProps}
            data={homeTeamNotes?.docs || []}
            total={homeTeamNotes?.totalDocs || 0}
            onLikeClick={likeNote}
            onUnLikeClick={unLikeNote}
          />
          <SectionHeading title={t('REPORTS')} />
          <ReportsTable
            {...homeReportsTableSettings}
            {...homeReportsTableProps}
            data={homeTeamReports?.docs || []}
            total={homeTeamReports?.totalDocs || 0}
            onLikeClick={likeReport}
            onUnLikeClick={unLikeReport}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1} title="away-team" noPadding>
          <SectionHeading title={t('NOTES')} />
          <NotesTable
            {...awayNoteTableSettings}
            {...awayNotesTableProps}
            data={awayTeamNotes?.docs || []}
            total={awayTeamNotes?.totalDocs || 0}
            onLikeClick={likeNote}
            onUnLikeClick={unLikeNote}
          />
          <SectionHeading title={t('REPORTS')} />
          <ReportsTable
            {...awayReportsTableSettings}
            {...awayReportsTableProps}
            data={awayTeamReports?.docs || []}
            total={awayTeamReports?.totalDocs || 0}
            onLikeClick={likeReport}
            onUnLikeClick={unLikeReport}
          />
        </TabPanel>
      </Box>
    </>
  )
}

const SectionHeading = ({ title }: { title: string }) => (
  <Typography variant="h3" align="center" paddingY={theme => theme.spacing(2)}>
    {title}
  </Typography>
)

export default MatchPage
