# 🎛️ Network Controller — Desktop Network Management & App Rule Engine

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** Web & Systems Development Laboratory  

---

## 📌 Aim & Objective
Build an automated desktop system utility and GUI using Python, Tkinter, and OS system interfaces to monitor Wi-Fi connectivity, track running applications, enforce peripheral hardware connection rules (charger / phone detection), and toggle network hardware states.

---

## 💡 Core Architecture & Modules
* **`network.py`:** macOS / UNIX network interface integration via `networksetup` CLI to inspect, enable, and disable Wi-Fi adapters.
* **`apps.py`:** Active process and application detection across operating system threads.
* **`device.py`:** Hardware telemetry checking peripheral device connections (charger status, USB phone tethering).
* **`app_rules.py` & `app_rules.json`:** Rule persistence engine configuring per-application network restriction policies.
* **`app.py`:** Modern desktop GUI dashboard built with Tkinter featuring live status indicators and application rule toggles.
* **`main.py`:** Interactive CLI terminal menu alternative for headless environments.

---

## 🚀 Key Features
* One-click Wi-Fi toggling and status diagnostics.
* Real-time hardware telemetry: Charger connection & phone connection detection.
* Automated rule enforcement: Restricting or allowing network access based on device states.
* Dual interface support: Full graphical Tkinter desktop UI + terminal CLI.

---

## 📁 Folder Structure
```text
network-controller/
├── app.py             # Tkinter desktop GUI dashboard
├── main.py            # Terminal CLI controller
├── network.py         # Wi-Fi hardware adapter controls
├── apps.py            # Process inspection logic
├── device.py          # Charger and phone hardware sensors
├── app_rules.py       # Rule engine logic
├── app_rules.json     # Configuration rule persistence
└── README.md          # Project documentation
```

---

## 🛠️ How to Run

### Graphical UI:
```bash
python3 app.py
```

### CLI Terminal:
```bash
python3 main.py
```
