import AdminHeader from './AdminHeader'
import DashboardOverview from './DashboardOverview'

export default function AdminPage() {
  return (
    <>
      <AdminHeader title="Dashboard Overview" />
      <DashboardOverview />
    </>
  )
}