import { Typography } from '@mui/material';
import { SimpleObject } from './simpleObject';

export const CustomAttributes = (props: {
  value: Record<string | number, string> | undefined | null;
}): JSX.Element => {
  return (
    <>
      <Typography variant="body1" fontWeight="bold">
        Custom Attributes
      </Typography>
      <SimpleObject value={props.value} />
    </>
  );
};
