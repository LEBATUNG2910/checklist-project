import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Cho phép dùng thẻ <img> thông thường cho external avatar
      "@next/next/no-img-element": "off",
      
      // Cho phép dùng setState trong useEffect (cần thiết cho Dark Mode)
      "react-hooks/set-state-in-effect": "off",
      
      // Cho phép dùng dấu ngoặc kép (") bình thường trong text
      "react/no-unescaped-entities": "off",
      
      // Chuyển lỗi dùng kiểu 'any' thành cảnh báo (warn) thay vì lỗi đỏ (error)
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Chuyển lỗi khai báo biến không sử dụng thành cảnh báo
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Tắt cảnh báo thiếu dependency trong useEffect (đôi khi bị sai ngữ cảnh)
      "react-hooks/exhaustive-deps": "warn"
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "lib/generated/**" 
  ]),
]);

export default eslintConfig;