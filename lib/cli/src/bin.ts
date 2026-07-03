#!/usr/bin/env node

import { Command } from "commander";
import { estudioCommand } from "./commands/estudio";

const program = new Command();

program
  .name("react-pdf-levelup")
  .description("CLI para react-pdf-levelup")
  .version("1.0.0");

program.addCommand(estudioCommand);

program.parse();
