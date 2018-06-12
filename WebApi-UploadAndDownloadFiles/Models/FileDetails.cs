using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi_UploadAndDownloadFiles.Models
{
    public class UploadFilesList
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FileDescription { get; set; }
        public string File { get; set; }
        public string FileType { get; set; }
    }
}