import { Button, IconButton } from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import React, { FC } from "react";
import { EditComponentProps } from "../../types";

export const EditComponent: FC = () => {
  return (
    <React.Fragment>
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
      <IconButton color="inherit" aria-label="open drawer" edge="start">
            <AddShoppingCart />
      </IconButton>
    </React.Fragment>
  );
};
