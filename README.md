# 🐶 Ancestral-Essence Website

Welcome to the **Ancestral-Essence** website project! This document is a complete, step-by-step guide designed specifically for you to easily install, run, and understand how to use this project on your own computer.

---

## 🌟 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites (What to install first)](#prerequisites)
3. [Step-by-Step Installation](#step-by-step-installation)
4. [How to Run the Project](#how-to-run-the-project)
5. [Understanding the Project Structure](#understanding-the-project-structure)
6. [Available Commands](#available-commands)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## 📖 1. Project Overview <a name="project-overview"></a>

The **Ancestral-Essence** project is a comprehensive web application designed for a beautiful and fast user experience. This repository contains all the code required to run the frontend website, backend services, and database configurations.

It is built as a "monorepo," which simply means all the different parts of the website (like the user interface, the server, and helpful scripts) are organized neatly within this single folder.

---

## 🛠️ 2. Prerequisites (What to install first) <a name="prerequisites"></a>

Before running this project, you need to install two basic tools on your computer. If you already have these, you can skip this section!

### 1. Node.js
Node.js allows your computer to run the code. 
- Go to [nodejs.org](https://nodejs.org/) and download the "LTS" (Long Term Support) version. 
- Run the installer and click "Next" through the default settings.

### 2. pnpm
We use a tool called `pnpm` to manage the project's code libraries. It makes downloading necessary files very fast.
- Once Node.js is installed, open your computer's terminal (Command Prompt on Windows, Terminal on Mac).
- Type the following command and press Enter:
  ```bash
  npm install -g pnpm
  ```

---

## 📥 3. Step-by-Step Installation <a name="step-by-step-installation"></a>

Follow these instructions carefully to set up the code on your machine.

### Step 1: Open the Project Folder
Open your terminal (Command Prompt or Terminal) and navigate to the folder where you have this project saved. 
For example:
```bash
cd path/to/Ancestral-Essence
```

### Step 2: Install Dependencies
This project relies on several pre-written code packages to work properly. To download them all automatically, type exactly this command and press Enter:
```bash
pnpm install
```
*Note: This process might take a few minutes. You will see text scrolling on your screen—just wait until it finishes completely.*

---

## 🚀 4. How to Run the Project <a name="how-to-run-the-project"></a>

Once everything is installed, you are ready to run the code!

### Step 1: Verify the Code
To ensure there are no errors in the setup, run the built-in health check:
```bash
pnpm run typecheck
```
If the command finishes without showing red errors, your setup is perfect.

### Step 2: Build the Application
To prepare the application for running or deploying to the internet, you need to "build" it. This optimizes all the code. Run:
```bash
pnpm run build
```
This will process all the files in the `artifacts`, `services`, and `scripts` folders and prepare them for use.

---

## 📂 5. Understanding the Project Structure <a name="understanding-the-project-structure"></a>

Here is a simple breakdown of what the folders in this project actually do:

- **`artifacts/`**: Contains the built pieces of the application, typically the frontend user interface.
- **`services/`**: Contains the backend services (the server-side code that works behind the scenes).
- **`supabase/`**: Contains the configuration files for the database, ensuring data is stored and retrieved securely.
- **`scripts/`**: Small helper programs used to automate development tasks.
- **`lib/`**: Shared code and utilities that different parts of the project use.
- **`Doctor Pic/`, `Logos/`, `Mini Logos/`**: Directories storing the images and branding assets for the website.
- **`package.json`**: The central configuration file that lists the project name, commands, and required libraries.
- **`.env`**: (If applicable) This file stores secret keys and passwords. Never share this file publicly!

---

## 📜 6. Available Commands <a name="available-commands"></a>

You can run these helpful shortcuts from your terminal at any time:

- **`pnpm run build`**: Compiles and optimizes the entire project.
- **`pnpm run typecheck:libs`**: Checks only the shared library code for any mistakes.
- **`pnpm run typecheck`**: Runs a comprehensive mistake-check across the entire project.

---

## 🚑 7. Troubleshooting Guide <a name="troubleshooting-guide"></a>

If you run into issues, try these common fixes:

**Issue:** Terminal says `"Command 'pnpm' not found"`
- **Fix:** You missed the prerequisite step. Make sure Node.js is installed, then run `npm install -g pnpm`.

**Issue:** Red errors appear when running `pnpm install`
- **Fix:** Your internet connection might have briefly dropped. Try deleting the `node_modules` folder and the `pnpm-lock.yaml` file in the project directory, then run `pnpm install` again. 

**Issue:** Errors appear during `pnpm run typecheck`
- **Fix:** This means there is a typo or mistake in the code itself. The terminal will point out the exact file and line number where the issue is located so it can be fixed by the development team.
