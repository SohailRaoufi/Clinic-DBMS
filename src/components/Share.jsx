import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Checkbox,
} from "@material-tailwind/react";
import { get, post } from "../utils/ApiFetch";

const ShareDialog = ({ open, handleOpen, id }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState("");
  const [shareData, setShareData] = useState({
    id: "",
    users: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await get("api/chats/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.success) {
        throw new Error("Network response was not ok");
      }
      const data = await response.data;
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserChange = (userId) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleSubmit = async () => {
    const allUsers = selectedUsers.join(",");
    const data = {
      id: id,
      users: allUsers,
    };
    setShareData(data);

    try {
      const response = await post("/api/chats/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      });

      if (!response.success) {
        throw new Error("Network response was not ok");
      }

      handleOpen(false);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleClose = () => {
    handleOpen(false);
    setSelectedUsers([]);
  };

  return (
    <div>
      <Dialog open={open} handler={handleClose}>
        <DialogHeader>Select Users to Share</DialogHeader>
        <DialogBody>
          <div>
            {users.map((user) => (
              <div key={user.id} className="flex items-center mb-2">
                <Checkbox
                  type="checkbox"
                  checked={selectedUsers.includes(user.email)}
                  onChange={() => handleUserChange(user.email)}
                  className="mr-2"
                />
                <label className="text-xl">{user.username}</label>
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button onClick={handleSubmit} disabled={selectedUsers.length === 0}>
            Send Data
          </Button>
          <Button
            color="red"
            className="m-2"
            onClick={handleOpen}
            variant="text"
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ShareDialog;
