import { Box, TextField } from '@mui/material'
import { Field, useFormikContext } from 'formik'
import { useTranslation } from 'next-i18next'
import React from 'react'

import { MatchesCombo } from '@/modules/matches/combo'
import { MatchBasicDataDto } from '@/modules/matches/types'

import { CreateReportDto } from '../types'

interface IMatchStepProps {
  matchesData: MatchBasicDataDto[]
}

export const MatchStep = ({ matchesData }: IMatchStepProps) => {
  const { t } = useTranslation()
  const { touched, errors } = useFormikContext<CreateReportDto>()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <MatchesCombo
        data={matchesData}
        name="matchId"
        label={t('MATCH')}
        error={touched.matchId && !!errors.matchId}
        helperText={touched.matchId ? errors.matchId : undefined}
      />
      <Field
        name="videoUrl"
        as={TextField}
        variant="outlined"
        fullWidth
        label={t('VIDEO_URL')}
        error={touched.videoUrl && !!errors.videoUrl}
        helperText={
          (touched.videoUrl && errors.videoUrl) || t('OPTIONAL_FIELD')
        }
      />
      <Field
        name="videoDescription"
        as={TextField}
        variant="outlined"
        fullWidth
        label={t('VIDEO_DESCRIPTION')}
        error={touched.videoUrl && !!errors.videoUrl}
        helperText={
          (touched.videoUrl && errors.videoUrl) || t('OPTIONAL_FIELD')
        }
      />
    </Box>
  )
}
