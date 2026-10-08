// 1. KHOI TAO CSDL THIET BI BAN DAU
const deviceList = [
  {
    id: "DEV_001",
    name: "Dieu hoa Inverter",
    room: "Living Room",
    isActive: true,
    powerWatts: 1200
  },
  {
    id: "DEV_002",
    name: "Den Am Tran",
    room: "Living Room",
    isActive: false,
    powerWatts: 18
  },
  {
    id: "DEV_003",
    name: "Den Ngu Smart",
    room: "Bedroom",
    isActive: true,
    powerWatts: 10
  }
];

let autoIdCounter = 4;

// 2. HAM KIEM CHUAN DU LIEU (VALIDATOR FUNCTION)
const validateDeviceData = (deviceData) => {
  if (!deviceData || typeof deviceData !== "object") {
    return { isValid: false, message: "Du lieu thiet bi phai la mot object." };
  }

  const { name, room, powerWatts } = deviceData;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return { isValid: false, message: "Ten thiet bi khong duoc de rong." };
  }

  if (!room || typeof room !== "string" || room.trim().length === 0) {
    return { isValid: false, message: "Ten phong khong duoc de rong." };
  }

  if (typeof powerWatts !== "number" || powerWatts <= 0) {
    return { isValid: false, message: "Cong suat powerWatts phai la so lon hon 0." };
  }

  return { isValid: true, message: "Du lieu hop le." };
};

// 3. CAU TRUC CAC HAM CRUD MANAGEMENT MODULE

// CREATE: Them thiet bi moi va tu sinh ma DEV_xxx
const createDevice = (list, newDev) => {
  const validation = validateDeviceData(newDev);
  if (!validation.isValid) {
    console.log(`[CREATE ERROR]: ${validation.message}`);
    return null;
  }

  const generatedId = "DEV_" + autoIdCounter.toString().padStart(3, "0");
  autoIdCounter++;

  const createdDevice = {
    id: generatedId,
    name: newDev.name.trim(),
    room: newDev.room.trim(),
    isActive: newDev.isActive !== undefined ? Boolean(newDev.isActive) : false,
    powerWatts: newDev.powerWatts
  };

  list.push(createdDevice);
  console.log(`[CREATE SUCCESS]: Da them thiet bi "${createdDevice.name}" voi ma ${createdDevice.id}`);
  return createdDevice;
};

// READ: Loc danh sach thiet bi theo phong
const readDevicesByRoom = (list, roomName) => {
  if (!roomName || typeof roomName !== "string") {
    console.log("[READ ERROR]: Ten phong truy van khong hop le.");
    return [];
  }

  const cleanedRoom = roomName.trim().toUpperCase();
  const matchedDevices = [];

  for (let i = 0; i < list.length; i++) {
    if (list[i].room.trim().toUpperCase() === cleanedRoom) {
      matchedDevices.push(list[i]);
    }
  }

  return matchedDevices;
};

// UPDATE: Cap nhat an toan khong bi dinh cam bi Falsy (0, false)
const updateDevice = (list, id, updateData) => {
  if (!id || !updateData) {
    console.log("[UPDATE ERROR]: Thieu ma ID hoac du lieu cap nhat.");
    return false;
  }

  let targetDevice = null;
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      targetDevice = list[i];
      break;
    }
  }

  if (!targetDevice) {
    console.log(`[UPDATE ERROR]: Khong tim thay thiet bi voi ma "${id}".`);
    return false;
  }

  if (updateData.name !== undefined && updateData.name.trim() !== "") {
    targetDevice.name = updateData.name.trim();
  }

  if (updateData.room !== undefined && updateData.room.trim() !== "") {
    targetDevice.room = updateData.room.trim();
  }

  if (updateData.isActive !== undefined) {
    targetDevice.isActive = Boolean(updateData.isActive);
  }

  if (updateData.powerWatts !== undefined && typeof updateData.powerWatts === "number") {
    targetDevice.powerWatts = updateData.powerWatts;
  }

  console.log(`[UPDATE SUCCESS]: Cap nhat thanh cong thiet bi "${id}".`);
  return true;
};

// DELETE: Go bo thiet bi khoi danh sach theo ma ID
const deleteDevice = (list, id) => {
  if (!id) {
    console.log("[DELETE ERROR]: Ma ID khong hop le.");
    return false;
  }

  let foundIndex = -1;
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex === -1) {
    console.log(`[DELETE ERROR]: Khong tim thay thiet bi voi ma "${id}" de xoa.`);
    return false;
  }

  const removedItem = list.splice(foundIndex, 1)[0];
  console.log(`[DELETE SUCCESS]: Da xoa thiet bi "${removedItem.name}" (Ma: ${removedItem.id}).`);
  return true;
};

// HAM HO TRO IN BANG DANH SACH THIET BI RA CONSOLE
const printDeviceReport = (list, title = "DANH SACH THIET BI SMART HOME") => {
  const borderLine = "-".repeat(75);
  console.log("\n" + borderLine);
  console.log(`                  ${title.toUpperCase()}                  `);
  console.log(borderLine);
  console.log(
    "MA TB".padEnd(10) +
    "TEN THIET BI".padEnd(25) +
    "PHONG".padEnd(16) +
    "TRANG THAI".padEnd(12) +
    "CONG SUAT".padStart(12)
  );
  console.log(borderLine);

  if (list.length === 0) {
    console.log("                        KHONG CO DU LIEU THIET BI                        ");
  } else {
    for (let i = 0; i < list.length; i++) {
      const dev = list[i];
      const colId = dev.id.padEnd(10);
      const colName = (dev.name.length > 23 ? dev.name.slice(0, 20) + "..." : dev.name).padEnd(25);
      const colRoom = dev.room.padEnd(16);
      const colStatus = (dev.isActive ? "DANG BAT" : "DA TAT").padEnd(12);
      const colPower = (dev.powerWatts + " W").padStart(12);

      console.log(`${colId}${colName}${colRoom}${colStatus}${colPower}`);
    }
  }

  console.log(borderLine);
  console.log(`TONG SO THIET BI: ${list.length.toString().padStart(8)} thiet bi`);
  console.log(borderLine);
};

// 4. KICH BAN KIEM THU TOAN DIEN MODULE CRUD

console.log("================================================");
console.log("TEST CASE 1: THIET LAP VA IN DANH SACH BAN DAU");
console.log("================================================");
printDeviceReport(deviceList, "Danh sach ban dau");

console.log("\n================================================");
console.log("TEST CASE 2: THIET LAP HAM CREATE (THEM THIET BI MOI)");
console.log("================================================");

// Thu tao sai du lieu (thieu powerWatts)
createDevice(deviceList, { name: "Quat Tran", room: "Living Room", powerWatts: 0 });

// Tao dung
createDevice(deviceList, {
  name: "Robot Lau Nha",
  room: "Living Room",
  isActive: true,
  powerWatts: 60
});

createDevice(deviceList, {
  name: "May Loc KHI",
  room: "Bedroom",
  isActive: false,
  powerWatts: 45
});

printDeviceReport(deviceList, "Danh sach sau khi them moi");

console.log("\n================================================");
console.log("TEST CASE 3: THIET LAP HAM READ (LOC THEO PHONG)");
console.log("================================================");
const livingRoomDevices = readDevicesByRoom(deviceList, "Living Room");
printDeviceReport(livingRoomDevices, "Thiet bi tai phong Living Room");

console.log("\n================================================");
console.log("TEST CASE 4: THIET LAP HAM UPDATE (CAP NHAT FALSY SAFE)");
console.log("================================================");
// Cap nhat isActive = false va powerWatts = 0 W
updateDevice(deviceList, "DEV_001", { isActive: false, powerWatts: 5 });
updateDevice(deviceList, "DEV_004", { powerWatts: 0 }); // cap nhat 0W an toan

printDeviceReport(deviceList, "Danh sach sau khi cap nhat DEV_001 va DEV_004");

console.log("\n================================================");
console.log("TEST CASE 5: THIET LAP HAM DELETE (GO BO THIET BI)");
console.log("================================================");
deleteDevice(deviceList, "DEV_002");
deleteDevice(deviceList, "DEV_999"); // Thu xoa id khong ton tai

printDeviceReport(deviceList, "Danh sach cuoi cung sau khi xoa DEV_002");
