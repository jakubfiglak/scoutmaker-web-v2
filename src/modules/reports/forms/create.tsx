import {
  Box,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
} from '@mui/material'
import { Field, Form, Formik } from 'formik'
import filter from 'just-filter-object'
import { useTranslation } from 'next-i18next'
import { ReactNode, useState } from 'react'

import { MainFormActions } from '@/components/forms/main-form-actions'
import { useAlertsState } from '@/context/alerts/useAlertsState'
import { CompetitionGroupBasicDataDto } from '@/modules/competition-groups/types'
import { CompetitionBasicDataDto } from '@/modules/competitions/types'
import { MatchBasicDataDto } from '@/modules/matches/types'
import { PlayerPositionDto } from '@/modules/player-positions/types'
import { PlayerBasicDataDto } from '@/modules/players/types'
import { ReportTemplatesCombo } from '@/modules/report-templates/combo'
import { useReportTemplatesList } from '@/modules/report-templates/hooks'
import { ReportTemplateBasicDataDto } from '@/modules/report-templates/types'
import { MetaStep } from '@/modules/reports/forms/meta-step'
import { SkillAssessmentsStep } from '@/modules/reports/forms/skill-assessments-step'
import { SummaryStep } from '@/modules/reports/forms/summary-step'
import { TeamBasicDataDto } from '@/modules/teams/types'
import { useStepper } from '@/utils/hooks/use-stepper'

import { CreateReportDto, ReportType } from '../types'
import { MatchStep } from './match-step'
import { PlayerStep } from './player-step'
import { ReportTypeStep } from './report-type-step'
import { StatsStep } from './stats-step'
import { StepActions } from './step-actions'

type TStep = {
  title: string
  content: ReactNode
  errorKeys?: string[]
}

interface ICreateFormProps {
  onSubmit: (data: CreateReportDto) => void
  onCancelClick?: () => void
  templatesData: ReportTemplateBasicDataDto[]
  ordersData: any[]
  playersData: PlayerBasicDataDto[]
  matchesData: MatchBasicDataDto[]
  positionsData: PlayerPositionDto[]
  teamsData: TeamBasicDataDto[]
  competitionsData: CompetitionBasicDataDto[]
  competitionGroupsData: CompetitionGroupBasicDataDto[]
  isOrderOptionDisabled?: boolean
}

const initialValues: CreateReportDto = {
  playerId: 0,
  templateId: 0,
  assists: 0,
  competitionGroupId: 0,
  competitionId: 0,
  finalRating: 0,
  goals: 0,
  matchId: 0,
  minutesPlayed: 0,
  positionPlayedId: 0,
  redCards: 0,
  shirtNo: 0,
  skillAssessments: [],
  summary: '',
  teamId: 0,
  videoDescription: '',
  videoUrl: '',
  yellowCards: 0,
}

export const CreateReportForm = ({
  onSubmit,
  onCancelClick,
  ordersData,
  matchesData,
  playersData,
  templatesData,
  teamsData,
  positionsData,
  competitionsData,
  competitionGroupsData,
  isOrderOptionDisabled,
}: ICreateFormProps) => {
  const { setAlert } = useAlertsState()
  const { t } = useTranslation()
  const { activeStep, handleNext, handleBack, setActiveStep } = useStepper()

  // TODO: handle this
  const activeOrderId = 0

  const [reportType, setReportType] = useState<ReportType>(
    activeOrderId ? 'order' : 'custom',
  )

  const steps: TStep[] = [
    {
      title: t('REPORT_TEMPLATE_STEP_TITLE'),
      content:
        templatesData.length > 0 ? (
          <ReportTemplatesCombo data={templatesData} name="templateId" />
        ) : (
          <p>{t('reports:PICK_REPORT_TEMPLATE')}</p>
        ),
    },
    {
      title: t('REPORT_TYPE_STEP_TITLE'),
      content: (
        <ReportTypeStep
          reportType={reportType}
          setReportType={setReportType}
          isOrderOptionDisabled={isOrderOptionDisabled}
          // isPlayerOptionDisabled={!!activeOrderId}
        />
      ),
    },
    {
      title:
        reportType === 'custom'
          ? t('reports:PLAYER_INFO_STEP_TITLE')
          : t('reports:ORDER_PLAYER_INFO_STEP_TITLE'),
      content:
        reportType === 'order' ? (
          // TODO: handle order step
          // <OrderStep ordersData={[]} />
          <div>Order step</div>
        ) : (
          <PlayerStep playersData={playersData} />
        ),
      errorKeys: ['player', 'order'],
    },
    {
      title: t('reports:MATCH_STEP_TITLE'),
      content: <MatchStep matchesData={matchesData} />,
      errorKeys: ['videoURL'],
    },
    {
      title: t('reports:SUMMARY_STEP_TITLE'),
      content: <SummaryStep />,
      errorKeys: ['summary'],
    },
    {
      title: t('reports:SKILL_ASSESSMENTS_STEP_TITLE'),
      content: <SkillAssessmentsStep />,
    },
    {
      title: t('reports:STATS_STEP_TITLE'),
      content: <StatsStep />,
    },
    {
      title: t('reports:META_STEP_TITLE'),
      content: (
        <MetaStep
          teamsData={teamsData}
          positionsData={positionsData}
          competitionsData={competitionsData}
          competitionGroupsData={competitionGroupsData}
        />
      ),
    },
  ]

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={generateCreateFormValidationSchema(t)}
      enableReinitialize
      onSubmit={(data, { resetForm }) => {
        // const dataToSubmit = filter(data, (_, value) => value)
        // onSubmit(dataToSubmit as CreateReportDto)
        onSubmit(data)
        // resetForm()
      }}
    >
      {({ handleReset, touched, errors }) => (
        <Form>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            sx={{ bgcolor: 'background.paper', px: 2, py: 1, borderRadius: 2 }}
          >
            {steps.map(step => (
              <Step key={step.title}>
                <StepLabel>{step.title}</StepLabel>
                <StepContent>
                  <Box sx={{ mt: 1 }}>{step.content}</Box>
                  <StepActions
                    activeStep={activeStep}
                    totalSteps={steps.length}
                    handleBack={handleBack}
                    handleNext={handleNext}
                    isNextButtonDisabled={false}
                    // isNextButtonDisabled={
                    //   (activeStep === 2 && !values.player && !values.order) ||
                    //   (activeStep === 4 && !values.summary)
                    // }
                  />
                </StepContent>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 2 }}>
            <MainFormActions
              label={t('REPORT')}
              onCancelClick={() => {
                if (onCancelClick) {
                  onCancelClick()
                }
                handleReset()
                setAlert({ msg: t('CHANGES_CANCELLED'), type: 'warning' })
              }}
            />
          </Box>
        </Form>
      )}
    </Formik>
  )
}
