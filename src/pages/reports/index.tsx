import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { withSessionSsr } from '../../lib/session'

export const getServerSideProps = withSessionSsr(async ({ locale }) => {
  const translations = await serverSideTranslations(locale || 'pl', ['common'])

  return {
    props: {
      ...translations,
    },
  }
})

const ReportsPage = () => <h1>Reports</h1>

export default ReportsPage
