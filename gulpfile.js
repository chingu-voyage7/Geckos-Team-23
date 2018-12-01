// task runner
const gulp = require("gulp");
// used to get environment variables
const dotenv = require("dotenv");
// used to replace string
const replace = require("gulp-replace");

dotenv.config();

/**
 * configuration object
 */
const config = {
  // Merriam Webster Dictionary API KEY
  dictionaryAPIKey: process.env.MW_Dictionary_API_KEY,
  // Merriam Webster Thesaurus API KEY
  thesaurusAPIKey: process.env.MW_Thesaurus_API_KEY,
  // path config
  paths: {
    // destination base path
    destBase: "dist/",
    contentScript: {
      src: "src/scripts/content.js",
      dest: "dist/scripts/",
    },
    others: {
      // all files in the src folder and subfolders
      src: ["src/**/*"],
    },
  },
};

gulp.task("replace", () => {
  return (
    gulp
      .src(config.paths.contentScript.src)
      // replace the occurence of this string with api key
      .pipe(replace("<<!--dict-api-key-->>", config.dictionaryAPIKey))
      .pipe(gulp.dest(config.paths.contentScript.dest))
  );
});

gulp.task("copy", () => {
  return gulp
    // we exclude the content script from the copied files
    .src([...config.paths.others.src, `!${config.paths.contentScript.src}`])
    .pipe(gulp.dest(config.paths.destBase));
});

gulp.task("default", gulp.parallel("replace", "copy"));
