import { useCallback, useState } from 'react'
import { deleteMedicine, fetchMedicines } from '../services/api'

export default function useMedicines(initialSearch = '') {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState(initialSearch)

  const loadMedicines = useCallback(async (searchTerm = '') => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchMedicines(searchTerm)
      setMedicines(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ??
          'Unable to load medicines. Start the Laravel API at http://127.0.0.1:8000 and retry.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const removeMedicine = useCallback(async (medicineId) => {
    await deleteMedicine(medicineId)
    setMedicines((currentMedicines) => currentMedicines.filter((medicine) => medicine.id !== medicineId))
  }, [])

  return {
    medicines,
    loading,
    error,
    search,
    setSearch,
    setMedicines,
    loadMedicines,
    removeMedicine,
  }
}