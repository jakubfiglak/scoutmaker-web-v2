import { TextField } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { useTranslation } from 'next-i18next'

import { Container } from '@/components/forms/container'
import { FilterFormActions } from '@/components/forms/filter-form-actions'

import { CompetitionJuniorLevelsFiltersDto } from '../types'

interface IFormProps {
  filters: CompetitionJuniorLevelsFiltersDto
  onFilter: (data: CompetitionJuniorLevelsFiltersDto) => void
  onClearFilters: () => void
}

export const CompetitionJuniorLevelsFilterForm = ({
  filters,
  onFilter,
  onClearFilters,
}: IFormProps) => {
  const { t } = useTranslation()

  return (
    <Formik
      initialValues={filters}
      onSubmit={data => onFilter(data)}
      enableReinitialize
    >
      {() => (
        <Form autoComplete="off">
          <Container>
            <Field
              name="name"
              as={TextField}
              variant="outlined"
              fullWidth
              label={t('NAME')}
              size="small"
            />
            <Field
              name="level"
              as={TextField}
              type='number'
              variant="outlined"
              fullWidth
              label={t('LEVEL')}
              size="small"
              inputProps={{ min: 1, max: 15, step: 1 }}
            />
            <FilterFormActions handleClearFilter={onClearFilters} />
          </Container>
        </Form>
      )}
    </Formik>
  )
}
