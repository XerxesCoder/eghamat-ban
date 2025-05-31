"use client";
import { getUserLodge } from "@/app/actions/lodge";
import { getUserReservations } from "@/app/actions/reserve";
import { getUserRooms } from "@/app/actions/rooms";
import { createContext, useContext, useEffect, useState } from "react";

const DataProvider = createContext(null);
export function useLodgeData() {
  const context = useContext(DataProvider);
  if (!context) {
    throw new Error("useLodgeData must be used within a DashboardProvider");
  }
  return context;
}
export default function DashbaordProvider({ children }) {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [userLodgeInfo, setuserLodgeInfo] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const getLodgeData = async () => {
    try {
      const rooms = await getUserRooms();
      setRooms(rooms?.data);
      const reservations = await getUserReservations();
      setReservations(reservations?.data);
      setIsDataLoaded(true);
      console.log("Room and Reservation data loaded");
    } catch (e) {
      console.log(e);
    }
  };

  const getUserLodgeInformation = async () => {
    try {
      const userInfo = await getUserLodge();
      setuserLodgeInfo(userInfo.data[0]);
      console.log("user data loaded");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getLodgeData();
    getUserLodgeInformation();
  }, []);

  return (
    <DataProvider.Provider
      value={{
        rooms,
        reservations,
        userLodgeInfo,
        isDataLoaded,
        getLodgeData,
        getUserLodgeInformation,
      }}
    >
      {children}
    </DataProvider.Provider>
  );
}
