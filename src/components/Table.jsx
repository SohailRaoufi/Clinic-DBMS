import { Card, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import Mypagination from "./MyPagination";

import "./styles/table.css";

export default function Table({ Table_head, data }) {
  const TABLE_HEAD = Table_head;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Calculate the indexes for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="tab">
      <Card className="table-body h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.filter((head) => head != "id").map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Action
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((patient, index) => (
              <tr key={patient.id} className="even:bg-blue-gray-50/50">
                {Table_head.filter((head) => head != "id").map((key) => (
                  <td key={key} className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {patient[key]}
                    </Typography>
                  </td>
                ))}
                <td className="p-4 flex gap-3">
                  <Link>
                    <Typography
                      as="p"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      Edit
                    </Typography>
                  </Link>
                  <Link
                    to={`/patients/${patient.id}`}
                    state={{ patient: patient }}
                  >
                    <Typography
                      as="p"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      Detail
                    </Typography>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="table-pag">
        <Mypagination
          totalPages={totalPages}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  );
}
