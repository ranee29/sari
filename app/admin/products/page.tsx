import AdminHeader from '../AdminHeader'
import ProductsListServer from './ProductsListServer'

export default function ProductsPage() {
  return (
    <>
      <AdminHeader title="Products" />
      <ProductsListServer />
    </>
  )
}