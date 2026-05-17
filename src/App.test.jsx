import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
// eslint-disable-next-line no-unused-vars
import App from './App'

describe('Compound Interest Calculator', () => {
  it('renders the calculator form', () => {
    render(<App />)
    expect(screen.getByLabelText('Starting Amount ($)')).toBeInTheDocument()
    expect(screen.getAllByLabelText('Annual Interest Rate (%)')[0]).toBeInTheDocument()
    expect(screen.getByLabelText('Duration (Years)')).toBeInTheDocument()
  })

  it('calculates compound interest correctly for valid inputs', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Starting Amount ($)'), { target: { value: '1000' } })
    fireEvent.change(screen.getAllByLabelText('Annual Interest Rate (%)')[0], { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Duration (Years)'), { target: { value: '10' } })

    expect(screen.getByText(/1,647\.01/)).toBeInTheDocument()
  })

  it('shows error for negative amount', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Starting Amount ($)'), { target: { value: '-500' } })
    fireEvent.change(screen.getAllByLabelText('Annual Interest Rate (%)')[0], { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Duration (Years)'), { target: { value: '10' } })

    expect(screen.getByText('Amount cannot be negative')).toBeInTheDocument()
  })

  it('shows error for invalid interest rate', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Starting Amount ($)'), { target: { value: '1000' } })
    fireEvent.change(screen.getAllByLabelText('Annual Interest Rate (%)')[0], { target: { value: 'abc' } })
    fireEvent.change(screen.getByLabelText('Duration (Years)'), { target: { value: '10' } })

    expect(screen.getByText('Please enter a valid percentage')).toBeInTheDocument()
  })

  it('shows error for duration less than 1', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Starting Amount ($)'), { target: { value: '1000' } })
    fireEvent.change(screen.getAllByLabelText('Annual Interest Rate (%)')[0], { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Duration (Years)'), { target: { value: '0' } })

    expect(screen.getByText('Duration must be at least 1 year')).toBeInTheDocument()
  })

  it('updates graph when interest rate changes', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Starting Amount ($)'), { target: { value: '1000' } })
    fireEvent.change(screen.getAllByLabelText('Annual Interest Rate (%)')[0], { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Duration (Years)'), { target: { value: '10' } })

    expect(screen.getByText(/1,647\.01/)).toBeInTheDocument()

    fireEvent.change(screen.getAllByLabelText('Annual Interest Rate (%)')[0], { target: { value: '7' } })

    expect(screen.getByText(/2,009\.66/)).toBeInTheDocument()
  })

  it('displays graph after calculation', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Starting Amount ($)'), { target: { value: '1000' } })
    fireEvent.change(screen.getAllByLabelText('Annual Interest Rate (%)')[0], { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Duration (Years)'), { target: { value: '10' } })

    expect(screen.getByText('Future Balance')).toBeInTheDocument()
  })
})