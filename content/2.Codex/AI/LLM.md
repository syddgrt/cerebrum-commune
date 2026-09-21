---
title: Local LLM
description: Running a local LLM using lightweight inferences (llama.cpp)
date: 2026-09-11
category: Linux
readingTime: 15
featured: true
published: true
---

The concept of being able to run a local llm right from your device is crazy especially if its ran on edge devices.

Some people find it uncomfortable that AI is slowly scraping data from users, at every prompt, which is a huge privacy issue. So some people chose to utilize the power of AI and LLM right from their own hardwares.

In order to run and use a LLM, there are two core things required
- `Inference Engine`
- `Models`

There are two ways you can run an inference.

# [`CPU Inference`]
- CPU Inference is basically the inference utilizing the CPU(Central Processing Unit) to perform the inference

# [`GPU Inference`]
- GPU Inference is basically the inference utilizing the GPU (Graphics Processing Unit) to perform the inference

::note

What's the difference?

- CPU is designed for tedious, heavy workloads that requires strong single-threaded performance but consists of much less cores compared to a GPU.

- GPU is designed to perform incredible parallel tasks that does is not as intense as a single task required to be performed by a CPU

:: 

It is so easy to get started!

First of all, go to

[https://github.com/ggml-org/llama.cpp] 

Imma assume you are on powershell and you literally never run any PS commands your whole life

Install Git for Windows

https://git-scm.com/download/win

1. Open Powershell


2. do `git clone https://github.com/ggml-org/llama.cpp`

3. do `cd llama/cpp`

4. do `git checkout master`

5. do `.\build.ps1`

6. do `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass.\build.ps1`

Congrats! You just installed the inference engine!

But wait...

You need a model to actually run LLM?

What is a model tho? LLM Model is at a high level, is basically a set of pre-trained dataset, that has undergone intense training session, the inference engine will read from this model

Models come in various sizes and shapes, some models are very minimal, the smallest open-sourced LLM model now is called TinyLlama1.1b, basically its 1.1b of tokens

Which is incredibly lightweight, and can be efficient for edge devices, like running it on a raspberry pi or even ESP32 microcontroller which is SICK!

https://www.youtube.com/watch?v=E6E_KrfyWFQ

Here is a video if you want to check out!

Basically





---
| Term           | What it really means               |
| -------------- | ---------------------------------- |
| Token          | Tiny text chunk                    |
| Tokens/sec     | How fast text appears              |
| Prompt t/s     | Reading input                      |
| Generation t/s | Actual thinking speed              |
| Context (`-c`) | Memory size                        |
| Q4             | Smaller & faster model             |
| Temp           | Creativity level                   |
| Top-k / Top-p  | How many word options it considers |
| Threads        | CPU helpers                        |
| `--ngl`        | How much runs on GPU               |
