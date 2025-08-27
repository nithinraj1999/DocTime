// components/MyPagination.tsx
"use client"; // only needed if using Next.js 13 app directory

import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface MyPaginationProps {
  page: number;
  count: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const MyPagination: React.FC<MyPaginationProps> = ({ page, count, onChange }) => {
  return (
    <Stack spacing={2}>
      <Pagination 
        count={count} 
        page={page} 
        onChange={onChange} 
        color="primary"
      />
    </Stack>
  );
};

export default MyPagination;
