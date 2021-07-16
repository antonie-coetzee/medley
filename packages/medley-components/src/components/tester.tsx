import { Button } from "@material-ui/core"
import React from "react"

export const renderComponent = ()=>{
  return <React.Fragment>
          <Button variant="contained">Default</Button>
      <Button variant="contained" color="primary">
        Primary
      </Button>
      <Button variant="contained" color="secondary">
        Secondary
      </Button>
      <Button variant="contained" disabled>
        Disabled
      </Button>
      <Button variant="contained" color="primary" href="#contained-buttons">
        Link
      </Button>
  </React.Fragment>
}