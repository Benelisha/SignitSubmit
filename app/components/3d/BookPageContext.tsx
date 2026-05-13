import React, { createContext, useContext, useState } from "react"

interface BookPageContextValue {
  page: number
  setPage: (page: number) => void
}

const BookPageContext = createContext<BookPageContextValue>({
  page: 0,
  setPage: () => undefined,
})

export const BookPageProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState(0)
  return (
    <BookPageContext.Provider value={{ page, setPage }}>
      {children}
    </BookPageContext.Provider>
  )
}

export const useBookPage = () => useContext(BookPageContext)
