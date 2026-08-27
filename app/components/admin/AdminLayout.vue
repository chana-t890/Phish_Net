<template>
  <div class="admin-shell min-h-screen bg-neutral-100">
    <div class="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]">
      <AdminSidebar />

      <main class="min-w-0 p-4 lg:p-8">
        <header class="mb-6 flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Phish-Net Admin</p>
            <h1 class="mt-1 text-2xl font-semibold text-neutral-900">
              <slot name="title">Admin Dashboard</slot>
            </h1>
          </div>

          <slot name="actions" />
        </header>

        <section class="min-w-0 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm lg:p-6">
          <slot />
        </section>
      </main>
    </div>
  </div>
</template>
