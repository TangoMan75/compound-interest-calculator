import { useState, useEffect, useCallback } from 'react'
// eslint-disable-next-line no-unused-vars
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function App() {
  const [startingAmount, setStartingAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [duration, setDuration] = useState('')
  const [monthlyDeposit, setMonthlyDeposit] = useState('')
  const [errors, setErrors] = useState({})
  const [futureBalance, setFutureBalance] = useState(null)
  const [totalInterest, setTotalInterest] = useState(null)
  const [graphData, setGraphData] = useState([])

  // Loan calculator state
  const [loanAmount, setLoanAmount] = useState('')
  const [loanRate, setLoanRate] = useState('')
  const [loanYears, setLoanYears] = useState('')
  const [loanResults, setLoanResults] = useState(null)

  const calculateCompoundInterest = useCallback((principal, rate, years, monthlyDeposit = 0) => {
    const monthlyRate = rate / 100 / 12
    const months = years * 12

    const principalGrowth = principal * Math.pow(1 + monthlyRate, months)
    const depositGrowth = monthlyDeposit * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)

    return principalGrowth + depositGrowth
  }, [])

  const calculateLoanPayment = (principal, annualRate, years) => {
    const monthlyRate = annualRate / 100 / 12
    const months = years * 12
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return payment
  }

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b']

  const getSavingsPieData = () => {
    const principal = parseFloat(startingAmount) || 0
    const deposits = (parseFloat(monthlyDeposit) || 0) * 12 * (parseInt(duration) || 0)
    const rate = parseFloat(interestRate) || 0
    const years = parseInt(duration) || 0
    
    if (principal <= 0 && deposits <= 0) return []
    
    const balance = calculateCompoundInterest(principal, rate, years, parseFloat(monthlyDeposit) || 0)
    const interest = Math.max(0, balance - principal - deposits)
    
    const data = [
      { name: 'Starting Amount', value: principal },
      { name: 'Deposits', value: deposits },
      { name: 'Interest', value: interest }
    ]
    return data.filter(d => d.value > 0)
  }

  const getLoanPieData = () => {
    const principal = parseFloat(loanAmount) || 0
    const rate = parseFloat(loanRate) || 0
    const years = parseInt(loanYears) || 0
    
    if (principal <= 0 || rate <= 0 || years <= 0) return []
    
    const monthlyPayment = calculateLoanPayment(principal, rate, years)
    const totalPayment = monthlyPayment * years * 12
    const interest = totalPayment - principal
    
    const data = [
      { name: 'Principal', value: principal },
      { name: 'Interest', value: interest }
    ]
    return data.filter(d => d.value > 0)
  }

  const generateGraphData = useCallback((principal, rate, years, monthlyDeposit = 0) => {
    const data = []
    for (let year = 0; year <= years; year++) {
      const balance = calculateCompoundInterest(principal, rate, year, monthlyDeposit)
      data.push({ year, balance: Math.round(balance * 100) / 100 })
    }
    return data
  }, [calculateCompoundInterest])

  const validateForm = () => {
    const newErrors = {}

    const amount = parseFloat(startingAmount)
    if (isNaN(amount) || amount < 0) {
      newErrors.startingAmount = amount < 0 ? 'Amount cannot be negative' : 'Please enter a valid amount'
    }

    const rate = parseFloat(interestRate)
    if (isNaN(rate)) {
      newErrors.interestRate = 'Please enter a valid percentage'
    }

    const years = parseInt(duration)
    if (isNaN(years) || years < 1) {
      newErrors.duration = 'Duration must be at least 1 year'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const principal = parseFloat(startingAmount)
    const rate = parseFloat(interestRate)
    const years = parseInt(duration)
    const monthly = monthlyDeposit ? parseFloat(monthlyDeposit) : 0

    const balance = calculateCompoundInterest(principal, rate, years, monthly)
    const totalDeposits = monthly * 12 * years
    const totalInterest = balance - principal - totalDeposits
    
    setFutureBalance(balance.toFixed(2))
    setTotalInterest(totalInterest.toFixed(2))
    setGraphData(generateGraphData(principal, rate, years, monthly))
  }

  useEffect(() => {
    const amount = parseFloat(startingAmount)
    const rate = parseFloat(interestRate)
    const years = parseInt(duration)
    const monthly = monthlyDeposit ? parseFloat(monthlyDeposit) : 0
    
    const newErrors = {}
    if (startingAmount && (isNaN(amount) || amount < 0)) {
      newErrors.startingAmount = amount < 0 ? 'Amount cannot be negative' : 'Please enter a valid amount'
    }
    if (interestRate && isNaN(rate)) {
      newErrors.interestRate = 'Please enter a valid percentage'
    }
    if (duration && (isNaN(years) || years < 1)) {
      newErrors.duration = 'Duration must be at least 1 year'
    }
    setErrors(newErrors)

    if (startingAmount && interestRate && duration && !isNaN(amount) && !isNaN(rate) && !isNaN(years) && amount >= 0 && years >= 1) {
      const balance = calculateCompoundInterest(amount, rate, years, monthly)
      const totalDeposits = monthly * 12 * years
      const totalInterest = balance - amount - totalDeposits
      setFutureBalance(balance.toFixed(2))
      setTotalInterest(totalInterest.toFixed(2))
      setGraphData(generateGraphData(amount, rate, years, monthly))
    }
  }, [startingAmount, interestRate, duration, monthlyDeposit, calculateCompoundInterest, generateGraphData])

  useEffect(() => {
    const amount = parseFloat(loanAmount)
    const rate = parseFloat(loanRate)
    const years = parseInt(loanYears)

    if (loanAmount && loanRate && loanYears && !isNaN(amount) && !isNaN(rate) && !isNaN(years) && amount > 0 && rate > 0 && years > 0) {
      const monthlyPayment = calculateLoanPayment(amount, rate, years)
      const totalPayment = monthlyPayment * years * 12
      const totalInterest = totalPayment - amount
      
      setLoanResults({
        monthlyPayment,
        totalPayment,
        totalInterest
      })
    } else {
      setLoanResults(null)
    }
  }, [loanAmount, loanRate, loanYears])

  return (
    <div className="min-h-screen py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
        Compound Interest Calculator
      </h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="starting-amount" className="font-medium text-slate-700">
              Starting Amount ($)
            </label>
            <input
              id="starting-amount"
              type="text"
              value={startingAmount}
              onChange={(e) => setStartingAmount(e.target.value)}
              className={`px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.startingAmount ? 'border-red-500' : 'border-slate-200'
              }`}
              placeholder="100000"
            />
            {errors.startingAmount && (
              <span className="text-red-600 text-sm">{errors.startingAmount}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="interest-rate" className="font-medium text-slate-700">
              Annual Interest Rate (%)
            </label>
            <input
              id="interest-rate"
              type="text"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className={`px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.interestRate ? 'border-red-500' : 'border-slate-200'
              }`}
              placeholder="5"
            />
            {errors.interestRate && (
              <span className="text-red-600 text-sm">{errors.interestRate}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="duration" className="font-medium text-slate-700">
              Duration (Years)
            </label>
            <input
              id="duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={`px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.duration ? 'border-red-500' : 'border-slate-200'
              }`}
              placeholder="10"
            />
            {errors.duration && (
              <span className="text-red-600 text-sm">{errors.duration}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="monthly-deposit" className="font-medium text-slate-700">
              Recurring Deposit (Monthly) ($)
            </label>
            <input
              id="monthly-deposit"
              type="text"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="100"
            />
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {futureBalance && (
              <div className="mb-6">
                <p className="text-slate-500 text-center mb-1">Future Balance</p>
                <p className="text-4xl font-bold text-center text-green-600">
                  ${Number(futureBalance).toLocaleString()}
                </p>
                {totalInterest && (
                  <p className="text-center text-blue-600 mt-2">
                    Total Interest Earned: ${Number(totalInterest).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {graphData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData} margin={{ top: 20, right: 20, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="year"
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      width={80}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Balance']}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">
                Enter values to see your projected savings growth
              </p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
            {getSavingsPieData().length > 0 ? (
              <>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getSavingsPieData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {getSavingsPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                  {getSavingsPieData().map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                      <span className="text-sm text-slate-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-slate-500 py-8">
                Enter values to see breakdown
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">
          Loan Calculator
        </h2>
        
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="loan-amount" className="font-medium text-slate-700">
              Loan Amount ($)
            </label>
            <input
              id="loan-amount"
              type="text"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="200000"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="loan-rate" className="font-medium text-slate-700">
              Annual Interest Rate (%)
            </label>
            <input
              id="loan-rate"
              type="text"
              value={loanRate}
              onChange={(e) => setLoanRate(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="3.25"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="loan-years" className="font-medium text-slate-700">
              Loan Term (Years)
            </label>
            <input
              id="loan-years"
              type="text"
              value={loanYears}
              onChange={(e) => setLoanYears(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="25"
            />
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {loanResults && (
              <div className="mb-6">
                <p className="text-slate-500 text-center mb-1">Monthly Payment</p>
                <p className="text-4xl font-bold text-center text-green-600">
                  ${loanResults.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex justify-center gap-8 mt-4 text-center">
                  <div>
                    <p className="text-slate-500 text-sm">Total Payment</p>
                    <p className="text-xl font-semibold text-slate-700">
                      ${loanResults.totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Total Interest</p>
                    <p className="text-xl font-semibold text-blue-600">
                      ${loanResults.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
            {getLoanPieData().length > 0 ? (
              <>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getLoanPieData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {getLoanPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                  {getLoanPieData().map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                      <span className="text-sm text-slate-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-slate-500 py-8">
                Enter values to see breakdown
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App