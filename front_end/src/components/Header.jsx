import styled from '@emotion/styled'
import React from 'react'

const HeaderContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center'
})
const Title = styled('h1')({
  color: 'GrayText'
})

export const Header = () => {
  return (
    <HeaderContainer>
      <Title>Header</Title>
    </HeaderContainer>

  )
}
