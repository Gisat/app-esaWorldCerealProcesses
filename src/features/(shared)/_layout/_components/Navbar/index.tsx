"use client";
import { Tabs } from "@mantine/core";
import React from "react";
import "./style.css";

const Navbar = ({
  children,
  activeValue,
}: {
  children: React.ReactNode;
  activeValue: string;
}) => {
  return (
    <Tabs value={activeValue} className="worldCereal-Navbar">
      <Tabs.List className="worldCereal-Navbar-list">{children}</Tabs.List>
    </Tabs>
  );
};

export default Navbar;
