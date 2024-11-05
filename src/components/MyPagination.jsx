import { useState, useEffect } from 'react';
import { Button, IconButton } from '@material-tailwind/react';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Mypagination({
  totalPages,
  currentPage,
  paginate,
  hasNext,
  hasPrev,
}) {
  const getItemProps = (index) => ({
    variant: currentPage === index ? 'filled' : 'text',
    color: 'gray',
    onClick: () => {
      paginate(index);
      if (index > currentPage) {
        hasNext();
      } else if (index < currentPage) {
        hasPrev();
      }
    },
  });

  const next = () => {
    if (currentPage === totalPages) return;

    paginate(currentPage + 1);
    hasNext();
  };

  const prev = () => {
    if (currentPage === 1) return;

    paginate(currentPage - 1);
    hasPrev();
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={currentPage === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
      </Button>
      {Array.from({ length: totalPages }, (_, index) => (
        <IconButton {...getItemProps(index + 1)} key={index + 1}>
          {index + 1}
        </IconButton>
      ))}
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={next}
        disabled={currentPage === totalPages}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
}
