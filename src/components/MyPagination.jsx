import React, { useState, useEffect } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Mypagination({ totalPages, currentPage, paginate }) {
  const [active, setActive] = useState(currentPage);

  useEffect(() => {
    setActive(currentPage);
  }, [currentPage]);

  //for styling the pagination button
  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => {
      setActive(index);
      paginate(index);
    },
  });

  const next = () => {
    if (active === totalPages) return;

    setActive(active + 1);
    paginate(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
    paginate(active - 1);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={active === 1}
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
        disabled={active === totalPages}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
}
