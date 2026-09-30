import React from 'react'

// External + async: React treats `<script async src>` as a hoistable resource, so no
// "script tag" warning when Next client-renders the layout (404 error shell). Flash is
// prevented by globals.css (`html { opacity: 0 }` until data-theme is set by this script).
export const InitTheme: React.FC = () => <script async src="/theme-init.js" />
