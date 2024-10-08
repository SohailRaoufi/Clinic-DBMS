import {
  Card,
  Typography,
  Button,
  Accordion,
  AccordionHeader,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { useWebSocket } from "../utils/webSocketProvider";

import { get } from "../utils/ApiFetch";

export default function Chat() {
  const [staff, setStaff] = useState([]);
  const { initializeWebSocket, closeWebSocket } = useWebSocket();

  useEffect(() => {
    initializeWebSocket();
    const hanldeStaff = async () => {
      const response = await get(`/api/chats/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.success) {
        console.log(response.data);
        return;
      }

      setStaff(response.data);
    };

    hanldeStaff();

    return () => {
      closeWebSocket();
    };
  }, [initializeWebSocket, closeWebSocket]);

  return (
    <div className="flex">
      <div style={{ width: "100%", paddingLeft: "1rem" }} className="h-screen">
        <Card className="p-5 rounded-none h-screen">
          <Typography color="black" variant="h4">
            Chat App
          </Typography>
          <hr
            style={{ marginTop: "1rem" }}
            className="my-2 border-blue-gray-50"
          />
          <div style={{ marginTop: "1rem" }}>
            {staff.map((val, index) => (
              <Accordion key={index} open={open === 1}>
                <Link
                  to={`/dashboard/chat/${val.id}`}
                  state={{
                    email: val.email,
                    username: val.username,
                    id: val.id,
                  }}
                >
                  <ListItem className="p-0" selected={open === 1}>
                    <AccordionHeader
                      onClick={() => handleOpen(1)}
                      className="border-b-0 p-3"
                    >
                      <Typography color="black" className="mr-auto font-normal">
                        {val.username}
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                </Link>
              </Accordion>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
