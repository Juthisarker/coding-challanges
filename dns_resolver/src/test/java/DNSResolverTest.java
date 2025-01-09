import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class DNSResolverTest {
    @Test
    void testResolveFromCache() throws IOException {
        DNSResolver resolver = new DNSResolver();
        resolver.addToCache("example.com", "93.184.216.34");

        String ipAddress = resolver.resolve("example.com");
        assertEquals("93.184.216.34", ipAddress, "The IP address should be resolved from cache");
    }

    @Test
    void testResolveFromServer() throws IOException {
        DNSResolver resolver = new DNSResolver();

        String ipAddress = resolver.resolve("example.com");
        assertEquals("93.184.216.34", ipAddress, "The IP address should be resolved from the server");
    }

    @Test
    void testAddToCache() throws IOException {
        DNSResolver resolver = new DNSResolver();
        resolver.addToCache("test.com", "192.168.1.1");

        assertDoesNotThrow(() -> resolver.resolve("test.com"));
        assertEquals("192.168.1.1", resolver.resolve("test.com"), "The IP address should match the cached value");
    }

    @Test
    void testBuildQuery() {
        DNSResolver resolver = new DNSResolver();
        byte[] query = resolver.buildQuery("example.com");

        assertNotNull(query, "The query should not be null");
        assertEquals("example.com", new String(query), "The query should match the hostname");
    }

    @Test
    void testParseResponse() {
        DNSResolver resolver = new DNSResolver();
        byte[] response = "93.184.216.34".getBytes();
        String result = resolver.parseResponse(response);

        assertEquals("93.184.216.34", result, "The response should be parsed correctly");
    }
}
