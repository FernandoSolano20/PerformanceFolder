using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TPL
{
    class Program
    {
        private static readonly HttpClient _client = new HttpClient();

        static async Task Main(string[] args)
        {
            Console.WriteLine("Await");
            var timer = new Stopwatch();
            timer.Start();
            var googleRequest = await MakeRequestAsync("https://www.google.com/");
            var youtubeRequest = await MakeRequestAsync("https://www.youtube.com/");
            timer.Stop();
            TimeSpan timeTaken = timer.Elapsed;
            string foo = "Time taken: " + timeTaken.ToString(@"m\:ss\.fff");
            Console.WriteLine(foo);

            Console.WriteLine("WaitAll");
            timer = new Stopwatch();
            timer.Start();
            var taskGoogleRequest = MakeRequestAsync("https://www.google.com/");
            var taskYoutubeRequest = MakeRequestAsync("https://www.youtube.com/");
            Task.WaitAll(taskYoutubeRequest, taskGoogleRequest);
            var response1 = taskGoogleRequest.GetAwaiter().GetResult();
            var response2 = taskYoutubeRequest.GetAwaiter().GetResult();
            timer.Stop();
            timeTaken = timer.Elapsed;
            foo = "Time taken: " + timeTaken.ToString(@"m\:ss\.fff");
            Console.WriteLine(foo);

            Console.WriteLine("WhenAll");
            timer = new Stopwatch();
            timer.Start();
            taskGoogleRequest = MakeRequestAsync("https://www.google.com/");
            taskYoutubeRequest = MakeRequestAsync("https://www.youtube.com/");
            await Task.WhenAll(taskYoutubeRequest, taskGoogleRequest);
            response1 = taskGoogleRequest.GetAwaiter().GetResult();
            response2 = taskYoutubeRequest.GetAwaiter().GetResult();
            timer.Stop();
            timeTaken = timer.Elapsed;
            foo = "Time taken: " + timeTaken.ToString(@"m\:ss\.fff");
            Console.WriteLine(foo);



            Console.ReadLine();
        }

        public static async Task<string> MakeRequestAsync(string url)
        {
            using (var request = new HttpRequestMessage(HttpMethod.Get, url))
            {
                using (var response = await _client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, new CancellationToken()).ConfigureAwait(false))
                {
                    var stream = await response.Content.ReadAsStreamAsync().ConfigureAwait(false);
                    var content = await StreamToStringAsync(stream).ConfigureAwait(false);
                    return content;
                }
            }
        }

        private static async Task<string> StreamToStringAsync(Stream stream)
        {
            string content;

            if (stream == null)
            {
                return null;
            }

            using (var sr = new StreamReader(stream))
            {
                content = await sr.ReadToEndAsync();
            }

            return content;
        }
    }
}
