import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalUsers: 0,
    lowStockMedicines: 0,
    expiredMedicines: 0
  })
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchMedicines()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/medicines')
      const data = await response.json()
      
      const lowStock = data.filter(m => m.quantity < 10).length
      const expired = data.filter(m => new Date(m.expiry_date) < new Date()).length
      
      setStats({
        totalMedicines: data.length,
        totalUsers: 1,
        lowStockMedicines: lowStock,
        expiredMedicines: expired
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchMedicines = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/medicines')
      const data = await response.json()
      setMedicines(data.slice(0, 10))
      setLoading(false)
    } catch (error) {
      console.error('Error fetching medicines:', error)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome to the Pharmacy Management System</p>
      </div>

      <Tabs defaultValue="overview" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
                <span className="text-2xl">💊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMedicines}</div>
                <p className="text-xs text-gray-500">Active medicines in inventory</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <span className="text-2xl">👥</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-gray-500">System users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <span className="text-2xl">⚠️</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.lowStockMedicines}</div>
                <p className="text-xs text-gray-500">Medicines below 10 units</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expired</CardTitle>
                <span className="text-2xl">⛔</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.expiredMedicines}</div>
                <p className="text-xs text-gray-500">Expired medicines</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medicines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Medicines</CardTitle>
              <CardDescription>
                View the latest medicines in your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-gray-500">Loading medicines...</p>
                </div>
              ) : medicines.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicines.map(medicine => {
                      const expiryDate = new Date(medicine.expiry_date)
                      const isExpired = expiryDate < new Date()
                      const isLowStock = medicine.quantity < 10

                      return (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell>{medicine.dosage}</TableCell>
                          <TableCell>{medicine.quantity}</TableCell>
                          <TableCell>${medicine.price}</TableCell>
                          <TableCell>{expiryDate.toLocaleDateString()}</TableCell>
                          <TableCell>
                            {isExpired && (
                              <Badge variant="destructive">Expired</Badge>
                            )}
                            {isLowStock && !isExpired && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                Low Stock
                              </Badge>
                            )}
                            {!isExpired && !isLowStock && (
                              <Badge variant="outline" className="border-green-500 text-green-600">
                                Available
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-gray-500">No medicines found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
